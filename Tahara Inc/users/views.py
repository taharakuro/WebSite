from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .forms import LoginForm, RegisterForm

def index(request):
    return render(request, 'users/index.html')

def sign_in(request):
    if request.method == 'GET':
        form = LoginForm()
        return render(request, 'users/login.html', {'form': form})
    
    elif request.method == 'POST':
        form = LoginForm(request.POST)
        
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('medsense')
            else:
                messages.error(request, 'Неправильное имя пользователя или пароль.')
        
        return render(request, 'users/login.html', {'form': form})

def sign_up(request):
    if request.method == 'GET':
        form = RegisterForm()
        return render(request, 'users/register.html', {'form': form})    

    elif request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()

            login(request, user)
            messages.success(request, 'Регистрация прошла успешно!')
            return redirect('medsense')
        else:
            # Добавляем сообщение об ошибке для пользователя
            messages.error(request, 'Ошибка при регистрации. Проверьте введенные данные.')
            return render(request, 'users/register.html', {'form': form})

