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
        institution_name = self.request.query_params.get('institution')
        institution_name = self.request.query_params.get('institution')
        institution_name = self.request.query_params.get('institution')
        institution_name = self.request.query_params.get('institution')
        institution_name = self.request.query_params.get('institution')
        institution_name = self.request.query_params.get('institution')

        if country_name:
            queryset = queryset.filter(institution_location__country_name=country_name)
        
        if institution_name:
            queryset = queryset.filter(institution_name=institution_name)

        return queryset
