from django.http import JsonResponse
from django.shortcuts import render
from .models import AssemblyConstituency, District
from django.views.decorators.csrf import csrf_exempt

def index(request):
    districts = District.objects.all()
    return render(request, 'booths/index.html', {'districts': districts})

@csrf_exempt
def get_assemblies(request, district_id):
    district_id = int(district_id)
    assemblies = AssemblyConstituency.objects.filter(district_id=district_id)
    return JsonResponse(list(assemblies.values()), safe=False)
