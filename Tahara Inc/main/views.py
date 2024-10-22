from django.shortcuts import render

def medsense(request):
    return render(request, 'main/medsense.html')

def fingenius(request):
    return render(request, 'main/fingenius.html')

def ecowatch(request):
    return render(request, 'main/ecowatch.html')