from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'


class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["guest_can_pause", "votes_to_skip"]

class UpdateRoomSerializer(serializers.Serializer):
    code = serializers.CharField()
    votes_to_skip = serializers.IntegerField()
    guest_can_pause = serializers.BooleanField()
