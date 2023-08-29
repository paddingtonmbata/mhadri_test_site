from django.urls import path
from . import views

urlpatterns = [
    path('course_data/', views.CourseDataList.as_view(), name='course-data-list'),
    path('teaching_mechanism_counts/', views.teaching_mechanism_counts, name='teaching_mechanism_counts'),
    path('country_course_count/', views.country_course_count, name='country_course_count'),
    path('country_chloropleth/', views.country_chloropleth, name='country_chloropleth'),
    path('country/<int:pk>', views.country, name="country"),
    path('courses_by_country/<str:country_code>', views.courses_by_country, name="courses_by_country"),
    path('type_of_course_counts/', views.type_of_course_counts, name='type_of_course_counts'),
]
