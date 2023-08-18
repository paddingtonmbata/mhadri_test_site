from rest_framework import serializers

from .models import CourseData

class CourseDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseData
        fields = '__all__'