from rest_framework import generics
from django.db.models import Q
from .models import CourseData
from .serializers import CourseDataSerializer

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
