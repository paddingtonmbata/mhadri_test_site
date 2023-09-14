from db import settings
from django.db.models import Q
from django.db.models import Count
from django.views.decorators.cache import cache_page
from django.core.cache import cache

from .models import *
from .serializers import *
from .mixins import ApiKeyRequiredMixin

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
import requests

@cache_page(60 * 15)
@api_view(['GET'])
def country_course_count(request):
    countries_with_counts = Country.objects.annotate(course_count=Count('coursedata')).filter(course_count__gt=0)
    ordered_countries = sorted(countries_with_counts, key=lambda x: x.course_count, reverse=True)
    countries_data = [{'country_name': country.country_name, 'course_count': country.course_count} for country in ordered_countries]
    serializer = CountryCourseCountSerializer(countries_data, many=True)
    return Response(serializer.data)

@cache_page(60 * 15)
@api_view(['GET'])
def country_by_name(request, country_name):
    countries = CourseData.objects.filter(institution_location__country_name=country_name)
    serializer = CourseDataSerializer(countries, many=True)
    return Response(serializer.data)

@cache_page(60 * 15)
@api_view(['GET'])
def teaching_mechanism_counts(request):
    teaching_mechanism_counts = CourseData.objects.values('teaching_mechanism').annotate(count=Count('id'))
    response_data = {
        'labels': [item['teaching_mechanism'] for item in teaching_mechanism_counts],
        'data': [item['count'] for item in teaching_mechanism_counts]
    }
    return Response(response_data)

@cache_page(60 * 15)
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

class CourseDataList(ApiKeyRequiredMixin, generics.ListAPIView):
    serializer_class = CourseDataSerializer

    def get_queryset(self):
        # Build a cache key based on filter parameters
        cache_key = f"course_data_{self.request.query_params.urlencode()}"
        print(f"current requested cache key: {cache_key}")

        # Try to fetch the queryset from the cache
        queryset = cache.get(cache_key)

        if queryset is None:
            # If not in cache, perform the original query and cache the result
            queryset = CourseData.objects.all()

            if 'search' in self.request.query_params:
                search_term = self.request.query_params['search']
                queryset = queryset.filter(
                    Q(type_of_course__icontains=search_term) |
                    Q(teaching_mechanism__icontains=search_term) |
                    Q(thematic_focus__icontains=search_term) |
                    Q(target_population__icontains=search_term) |
                    Q(scope__icontains=search_term) |
                    Q(objective_of_training__icontains=search_term) |
                    Q(teaching_approach__icontains=search_term) |
                    Q(institution_location__country_name__icontains=search_term)
                )
            # Cache the queryset for a specific duration 
            cache.set(cache_key, queryset, 60 * 15)  # Cache for 15 minutes

        return queryset
    
@cache_page(60 * 15)
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
def courses_by_category_code(request, country_code ,category):
    courses = CourseData.objects.filter(institution_location__country_code=country_code).filter( 
        Q(type_of_course__icontains=category) |
        Q(teaching_mechanism__icontains=category) |
        Q(thematic_focus__icontains=category) |
        Q(target_audience__icontains=category)
    )
    serializer = CourseDataSerializer(courses, many=True)
    return Response(serializer.data)
@api_view(['GET'])
def courses_by_category(request, category):
    courses = CourseData.objects.all().filter( 
        Q(type_of_course__icontains=category) |
        Q(teaching_mechanism__icontains=category) |
        Q(thematic_focus__icontains=category)  |
        Q(target_audience__icontains=category)
    )
    serializer = CourseDataSerializer(courses, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def type_of_course_counts_by_code(request, country_code):
    courses = CourseData.objects.filter(institution_location__country_code=country_code).values('type_of_course').annotate(count=Count('id'))
    response_data = {
        'labels':[item['type_of_course'] for item in courses],
        'data':[item['count'] for item in courses],
    }
    return Response(response_data)

@api_view(['GET'])
def thematic_focus_counts(request):
    thematic_focus_counts = CourseData.objects.values('thematic_focus').annotate(count=Count('id'))
    response_data = {
        'labels': [item['thematic_focus'] for item in thematic_focus_counts],
        'data': [item['count'] for item in thematic_focus_counts]
    }
    return Response(response_data)


@api_view(['GET'])
def thematic_focus_counts_by_code(request, country_code):
    thematic_focus_counts = CourseData.objects.filter(institution_location__country_code=country_code).values('thematic_focus').annotate(count=Count('id'))
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

@api_view(['GET'])
def target_audience_counts_by_code(request, country_code):
    target_audience_counts = CourseData.objects.filter(institution_location__country_code=country_code).values('target_audience').annotate(count=Count('id'))
    response_data = {
        'labels': [item['target_audience'] for item in target_audience_counts],
        'data': [item['count'] for item in target_audience_counts]
    }
    return Response(response_data)


@api_view(['GET'])
def teaching_mechanism_counts_by_code(request, country_code):
    teaching_mechanism_counts = CourseData.objects.filter(institution_location__country_code=country_code).values('teaching_mechanism').annotate(count=Count('id'))
    response_data = {
        'labels': [item['teaching_mechanism'] for item in teaching_mechanism_counts],
        'data': [item['count'] for item in teaching_mechanism_counts]
    }
    return Response(response_data)