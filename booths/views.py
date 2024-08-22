from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import AssemblyConstituency, District, VotingBooth, User

@csrf_exempt
def get_assemblies(request, district_id):
    district_id = int(district_id)
    assemblies = AssemblyConstituency.objects.filter(district_id=district_id)
    return JsonResponse(list(assemblies.values()), safe=False)

def index(request):
    if request.method == "GET":
        districts = District.objects.all()
        return render(request, 'booths/index.html', {'districts': districts})
    elif request.method == "POST":
        data = request.POST
        district_id = data.get('districts')
        assembly_id = data.get('assemblies')
        if not district_id or not assembly_id:
            return HttpResponseBadRequest("Missing or invalid district or assembly data.")
        request.session['district_id'] = district_id
        request.session['assembly_id'] = assembly_id
        return redirect('get_name_or_id')

def get_users(district_id, assembly_id, name=None, voter_id=None):
    user_query = User.objects.filter(district_id=district_id, assembly_constituency_id=assembly_id)
    if name:
        user_query = user_query.filter(name__icontains=name)
    if voter_id:
        user_query = user_query.filter(voter_id=voter_id)
    return list(user_query.values())

def get_name_or_id(request):
    district = request.session.get('district_id')
    assembly = request.session.get('assembly_id')

    if request.method == "POST":
        data = request.POST
        name = data.get('name')
        voter_id = data.get('voter_id')
        if not name and not voter_id:
            return HttpResponseBadRequest("Missing or invalid data.")
        users = get_users(district, assembly, name=name, voter_id=voter_id)
        request.session['name'] = name
        request.session['voter_id'] = voter_id
        request.session['users'] = users
        return redirect('select_user')

    if request.method == "GET":
        return render(request, 'booths/secondpage.html')

def select_user(request):
    users = request.session.get('users')
    return render(request, 'booths/selection_page.html', {'users': users})

def final_page(request, user_id):
    user = get_object_or_404(User, id=user_id)
    booth = user.voting_booth
    geo_data = VotingBooth.objects.filter(id=booth.id)
    return render(request, 'booths/final_page.html', {'geo_data': geo_data, 'username': request.session.get('name')})
