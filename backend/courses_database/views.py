from rest_framework import generics
from django.db.models import Q
from .models import *
from .serializers import *
from django.db.models import Count
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def country_course_count(request):
    countries_with_counts = Country.objects.annotate(course_count=Count('coursedata')).filter(course_count__gt=0)
    ordered_countries = sorted(countries_with_counts, key=lambda x: x.course_count, reverse=True)
    countries_data = [{'country_name': country.country_name, 'course_count': country.course_count} for country in ordered_countries]
    serializer = CountryCourseCountSerializer(countries_data, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def teaching_mechanism_counts(request):
    teaching_mechanism_counts = CourseData.objects.values('teaching_mechanism').annotate(count=Count('id'))
    response_data = {
        'labels': [item['teaching_mechanism'] for item in teaching_mechanism_counts],
        'data': [item['count'] for item in teaching_mechanism_counts]
    }
    return Response(response_data)

@api_view(['GET'])
def country_chloropleth(request):
    countries_with_counts = Country.objects.annotate(course_count=Count('coursedata')).filter(course_count__gt=0)
    countries_data = [{f'{country.country_code}': country.course_count} for country in countries_with_counts]
    return Response(countries_data)

@api_view(['GET'])
def country(request, pk):
    country = Country.objects.get(pk=pk)
    serializer = CountrySerializer(country, many=False)
    return Response(serializer.data)

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
                Q(institution_location__icontains=search_term)
            )            

        return queryset
    
@api_view(['GET'])
def type_of_course_counts(request):
    type_of_course_counts = CourseData.objects.values('type_of_course').annotate(count=Count('id'))
    response_data = {
        'labels': [item['type_of_course'] for item in type_of_course_counts],
        'data': [item['count'] for item in type_of_course_counts]
    }
    return Response(response_data)

@api_view(['GET'])
def courses_by_country(request, country_code):
    courses = CourseData.objects.filter(institution_location__country_code=country_code)
    serializer = CourseDataSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def thematic_focus_counts(request):
    thematic_focus_counts = CourseData.objects.values('thematic_focus').annotate(count=Count('id'))
    response_data = {
        'labels': [item['thematic_focus'] for item in thematic_focus_counts],
        'data': [item['count'] for item in thematic_focus_counts]
    }
    return Response(response_data)

@api_view(['GET'])
def target_audience_counts(request):
    target_audience_counts = CourseData.objects.values('target_audience').annotate(count=Count('id'))
    response_data = {
        'labels': [item['target_audience'] for item in target_audience_counts],
        'data': [item['count'] for item in target_audience_counts]
    }
    return Response(response_data)
