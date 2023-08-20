from django.urls import path
from .views import *

urlpatterns = [
    path('api/course_data/', CourseDataList.as_view(), name='course-data-list'),
    path('api/country_course_count/', country_course_count, name='country_course_count'),
]
