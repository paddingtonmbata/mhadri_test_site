# decorators.py

from django.http import JsonResponse
from db import settings

def api_key_required(view_func):
    def _wrapped_view(request, *args, **kwargs):
        expected_api_key = settings.API_KEY
        provided_api_key = request.META.get("HTTP_X_API_KEY") 
        print(provided_api_key)
        print(expected_api_key)

        headers = request.META
        for key, value in headers.items():
            print(f'{key} : {value}')

        if provided_api_key != expected_api_key:
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return view_func(request, *args, **kwargs)

    return _wrapped_view
