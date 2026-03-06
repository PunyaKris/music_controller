from django.urls import path
from .views import CreateRoomView, ListRoomView, GetRoomView, JoinRoomView, LeaveRoomView, UserInRoomView, UpdateRoomView

urlpatterns = [
    path('', ListRoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room/<str:code>', GetRoomView.as_view()),    
    path("join-room", JoinRoomView.as_view()),
    path("leave-room", LeaveRoomView.as_view()),
    path("user-in-room", UserInRoomView.as_view()),
    path("update-room", UpdateRoomView.as_view()),
]
