from rest_framework import generics
from django.db.models import Q
from .models import *
from .serializers import *
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def country_course_count(request):
    countries_with_counts = Country.objects.annotate(course_count=Count('coursedata'))
    ordered_countries = sorted(countries_with_counts, key=lambda x: x.course_count, reverse=True)
    countries_data = [{'country_name': country.country_name, 'course_count': country.course_count} for country in ordered_countries]
    serializer = CountryCourseCountSerializer(countries_data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def country_chloropleth(request):
    countries_with_counts = Country.objects.annotate(course_count=Count('coursedata'))
    countries_data = [{f'{country.country_code}': country.course_count} for country in countries_with_counts]
    return Response(countries_data)
        

class CourseDataList(generics.ListAPIView):
    serializer_class = CourseDataSerializer

    def get_queryset(self):
        queryset = CourseData.objects.all()
        country_name = self.request.query_params.get('country')
        institution_name = self.request.query_params.get('institution')
        teaching_mechanism = self.request.query_params.get('teaching_mechanism')
        target_population = self.request.query_params.get('target_population')
        target_audience = self.request.query_params.get('target_audience')
        type_of_course = self.request.query_params.get('type_of_course')
        search_term = self.request.query_params.get('search')

        if search_term:
            queryset = queryset.filter(
                Q(type_of_course__icontains=search_term) |
                Q(thematic_focus__icontains=search_term) |
                Q(target_population__icontains=search_term) |
                Q(scope__icontains=search_term) |
                Q(objective_of_training__icontains=search_term) |
                Q(teaching_approach__icontains=search_term) |
                Q(frequency_of_training__icontains=search_term)
            )
        elif country_name:
            queryset = queryset.filter(institution_location__country_name=country_name)        
        elif institution_name:
            queryset = queryset.filter(institution_name=institution_name)
            

        return queryset