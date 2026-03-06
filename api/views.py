from django.shortcuts import render
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from .authentication import CsrfExemptSessionAuthentication
from rest_framework.permissions import AllowAny

class ListRoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


@method_decorator(csrf_exempt, name="dispatch")
class CreateRoomView(generics.CreateAPIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = (AllowAny,)
    serializer_class = CreateRoomSerializer

    def post(self, request, *args, **kwargs):
        if not request.session.session_key:
            print("New Session Created")
            request.session.create()

        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data["guest_can_pause"]
            votes_to_skip = serializer.validated_data["votes_to_skip"]
            host = request.session.session_key

            if Room.objects.filter(host=host).exists():
                return Response({"ERROR": "You already have an active room"}, status=status.HTTP_400_BAD_REQUEST)

            room = Room.objects.create(
                host = host,
                guest_can_pause =  guest_can_pause,
                votes_to_skip =  votes_to_skip
            )

            request.session['room_code'] = room.code
        
            return Response(
                RoomSerializer(room).data,
                status=status.HTTP_201_CREATED
            )
        else:
            return Response({"Bad Request: Data Provided is not valis"}, status = status.HTTP_400_BAD_REQUEST)


class GetRoomView(generics.RetrieveAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = "code"

# Information about RetrieveAPIView :
    # RetrieveAPIView takes queryset and lookup_field
    # This code is class version of how to extract data given in url (Path Parameters)
    # queryset is the model to search in
    # lookup_field is the field of model to look for
    # now if <str:code> and api/room/ABCXYZ happens then kwargs is passed as key value pair {"code": "ABCXYZ"}

    def retrieve(self, request, *args, **kwargs):
        room = self.get_object() # Throws error of 404 if room of that code does not exis, can be seen in console
        data = self.get_serializer(room).data
        data["is_host"] = request.session.session_key == room.host
        return Response(data)

@method_decorator(csrf_exempt, name="dispatch")
class JoinRoomView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    def post(self, request):
        if not request.session.session_key:
            request.session.create()

        code = request.data.get("code")

        if not code:
            return Response(
                {"error": "Room code required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not Room.objects.filter(code=code).exists():
            return Response(
                {"error": "Not Valid Room Code"},
                status=status.HTTP_404_NOT_FOUND
            )

        existing_room = request.session.get("room_code")

        if existing_room:
            if existing_room == code:
                return Response(
                    {"message": "Already in this room"},
                    status=status.HTTP_200_OK
                )
            return Response(
                {"error": f"Already in another room with code: {request.session.get('room_code') } "},
                status=status.HTTP_403_FORBIDDEN
            )

        request.session["room_code"] = code
        return Response({"message": "Joined room"}, status=status.HTTP_200_OK)
    


@method_decorator(csrf_exempt, name="dispatch")
class LeaveRoomView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    def post(self, request):
        session = request.session

        # If user is not in any room
        room_code = session.get("room_code")
        if not room_code:
            return Response(
                {"error": "Not in a room"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove room_code from session
        session.pop("room_code")

        # Check if this user is the host of a room
        host_id = session.session_key
        room = Room.objects.filter(host=host_id).first()

        if room:
            room.delete()

        return Response(
            {"message": "Left room successfully"},
            status=status.HTTP_200_OK
        )

class UserInRoomView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)

    def get(self, request):
        if not request.session.session_key:
            request.session.create()

        return Response(
            {
                "room_code": request.session.get("room_code")
            },
            status=status.HTTP_200_OK
        )

@method_decorator(csrf_exempt, name="dispatch")
class UpdateRoomView(APIView):
    authentication_classes = (CsrfExemptSessionAuthentication,)
    permission_classes = (AllowAny,)
    serializer_class = UpdateRoomSerializer

    def patch(self, request):
        if not request.session.session_key:
            request.session.create()

        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.validated_data["guest_can_pause"]
            votes_to_skip =  serializer.validated_data["votes_to_skip"]
            code = serializer.validated_data["code"]
        else:
            return Response({"ERROR": "Invalid Data Provided"}, status=status.HTTP_400_BAD_REQUEST)

        
        rooms = Room.objects.filter(code = code)
        if rooms.exists():
            room = rooms[0]
            if room.host != request.session.session_key:
                return Response({"ERROR": "You Are Not The Host"}, status=status.HTTP_403_FORBIDDEN)
            else:
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                return Response({"message": "Room updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"ERROR": "Room Not Found"}, status = status.HTTP_404_NOT_FOUND)
        
