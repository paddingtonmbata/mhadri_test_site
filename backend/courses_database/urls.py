from django.urls import path
from . import views

urlpatterns = [
    path('course_data/', views.CourseDataList.as_view(), name='course-data-list'),
    path('country_course_count/', views.country_course_count, name='country_course_count'),
    path('country_chloropleth/', views.country_chloropleth, name='country_chloropleth'),
    path('country/<int:pk>', views.country, name="country"),
    path('courses_by_country/<str:country_code>', views.courses_by_country, name="courses_by_country"),
    path('type_of_course_counts/', views.type_of_course_counts, name='type_of_course_counts'),
    path('thematic_focus_counts/', views.thematic_focus_counts, name='thematic_focus_counts'),
    path('target_audience_counts/', views.target_audience_counts, name='target_audience_counts'),
    path('teaching_mechanism_counts/', views.teaching_mechanism_counts, name='teaching_mechanism_counts'),
    path('type_of_course_counts_by_code/<str:country_code>', views.type_of_course_counts_by_code, name='type_of_course_counts_by_code'),
    path('thematic_focus_counts_by_code/<str:country_code>', views.thematic_focus_counts_by_code, name='thematic_focus_counts_by_code'),
    path('target_audience_counts_by_code/<str:country_code>', views.target_audience_counts_by_code, name='target_audience_counts_by_code'),
    path('teaching_mechanism_counts_by_code/<str:country_code>', views.teaching_mechanism_counts_by_code, name='teaching_mechanism_counts_by_code'),
    path('courses_by_category_code/<str:country_code>/<str:category>', views.courses_by_category_code, name='courses_by_category_code'),
    path('courses_by_category/<str:category>', views.courses_by_category, name='courses_by_category'),
    path('country_by_name/<str:country_name>', views.country_by_name, name='country_by_name'),
]
