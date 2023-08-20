from django.core.management.base import BaseCommand
from courses_database.models import CourseData, Country
import pandas as pd

class Command(BaseCommand):
    help = 'Populate CourseData model with data from Excel file'

    def handle(self, *args, **options):
        excel_file_path = 'static/mhadri_database.xlsx' 
        df = pd.read_excel(excel_file_path)

        for _, row in df.iterrows():
            country, created = Country.objects.get_or_create(country_name=row['Institution Location'])
            CourseData.objects.create(
                source=row['Source'],
                institution_name=row['Institution'],
                institution_location=country,
                type_of_course=row['Type of course'],
                thematic_focus=row['Thematic focus'],
                target_population=row['Target population( group that the studies focuses on, ie Migrants)'],
                scope=row['Scope'],
                objective_of_training=row['Objectives of training'],
                target_audience=row['Target audience'],
                traings_faculty=row['Trainings/Faculty (including qualifications)'],
                teaching_mechanism=row['Teaching Mechanism(online or face to face)'],
                teaching_approach=row['Teaching approach'],
                frequency_of_training=row['Frequency of Training'],
                funding_schemes=row['Funding Schemes'],
                sustainibility_factors=row['Sustainabiity Factors'],
                key_challenges=row['Key Challenges']
            )

        self.stdout.write(self.style.SUCCESS('Data populated successfully'))
