from django.urls import path
from . import views

urlpatterns = [
    path('course_data/', views.CourseDataList.as_view(), name='course-data-list'),
    path('country_course_count/', views.country_course_count, name='country_course_count'),
]
