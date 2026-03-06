from django.urls import path
from .views import index

urlpatterns = [
    path("", index, name = ''),
]
''' handled in project's urls.py '''


