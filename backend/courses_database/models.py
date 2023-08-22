from django.db import models

class Country(models.Model):
    country_name = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2)

    def __str__(self):
        return self.country_name
    
    

class TeachingMechanisms(models.TextChoices):
    ONLINE = 'Online', 'Online'
    FACETOFACE = "Face to Face", 'Face to Face'
    BOTH = 'Both', 'Both'

class CourseData(models.Model):
    source = models.URLField(max_length=200)
    institution_name = models.CharField(max_length=100)
    institution_location = models.ForeignKey(Country, on_delete=models.CASCADE)
    type_of_course = models.CharField(max_length=200)
    thematic_focus = models.TextField()
    target_population = models.CharField(max_length=100)
    scope = models.TextField()
    objective_of_training = models.CharField(max_length=100)
    target_audience = models.CharField(max_length=100)
    traings_faculty = models.TextField()
    teaching_mechanism = models.CharField(choices=TeachingMechanisms.choices, default=TeachingMechanisms.ONLINE, max_length=20)
    teaching_approach = models.CharField(max_length=100)
    frequency_of_training = models.CharField(max_length=100)
    funding_schemes = models.TextField()
    sustainibility_factors = models.TextField()
    key_challenges = models.TextField()

    def __str__(self):
        return f"Course information for {self.institution_name}, {self.institution_location} focusing on {self.thematic_focus}"

