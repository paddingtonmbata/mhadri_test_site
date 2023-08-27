from rest_framework import serializers

from .models import *

class CourseDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseData
        fields = '__all__'

class CountryCourseCountSerializer(serializers.Serializer):
    country_name = serializers.CharField()
    course_count = serializers.IntegerField()

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'