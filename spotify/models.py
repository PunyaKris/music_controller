from django.db import models
from api.models import Room

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=150)
    token_type = models.CharField(max_length=50)
    expires_in = models.DateTimeField() 

class Vote(models.Model):
    user = models.CharField(max_length=50) # Remove unique=True here
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    class Meta:
        # This ensures a user can only have ONE vote per song ID
        unique_together = ('user', 'room', 'song_id')

