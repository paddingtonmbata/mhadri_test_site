# mixins.py

from .decorators import api_key_required

class ApiKeyRequiredMixin:
    @classmethod
    def as_view(cls, **initkwargs):
        view = super().as_view(**initkwargs)
        return api_key_required(view)
