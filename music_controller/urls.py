from django.contrib import admin
from django.urls import path, include, re_path
from frontendApp.views import index

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path('spotify/', include('spotify.urls')),

    # React SPA catch-all (LAST)
    re_path(r"^(?!admin($|/)|api($|/)).*$", index),
]


    # re_path(r"^(?!admin($|/)|api($|/)).*$", index),


'''

# To direct any url that begins with abc/... to frontendA's index.html
     re_path(r"^abc/.*$", frontendA_index),

# To direct any url that begins with abc/... to frontendA's index.html
     re_path(r"^xyz/.*$", frontendB_index),

# To exclude the urls starting from admin or api
    re_path(r"^(?!admin($|/)|api($|/)).*$", index),


'''