from django.urls import path
from .views import CourseDataList

urlpatterns = [
    path('api/course_data/', CourseDataList.as_view(), name='course-data-list'),
]
