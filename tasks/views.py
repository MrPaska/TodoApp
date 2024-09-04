from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import *
from django.contrib import messages
from django.utils import timezone
from datetime import datetime


def main(request, filter=None):
    if filter == 'comp':
        tasks = Task.objects.filter(complete=True)
    elif filter == 'not_comp':
        tasks = Task.objects.filter(complete=False)
    else:
        tasks = Task.objects.all()
    context = {'tasks': tasks}
    return render(request, 'tasks/main.html', context)


def addTask(request):
    if request.method == 'POST':
        try:
            task_title = request.POST.get('title')
            duration = datetime.fromisoformat(request.POST.get('duration'))
            description = request.POST.get('description')
            new_task = Task(title=task_title, description=description, duration=timezone.make_aware(duration))
            new_task.save()
            if new_task.id:
                messages.success(request, 'Task was added successfully!')
            else:
                raise Exception('Task not added. No ID generated!')
        except Exception as e:
            messages.error(request, 'Error. Task was not added to the list!')
            print(e)
    return redirect('/')


def getTaskData(request, pk):
    try:
        task = Task.objects.get(id=pk)
        data = {
            'id': pk,
            'title': task.title,
            'duration': task.duration.isoformat()[:16],
            'description': task.description
        }
        return JsonResponse(data)
    except Task.DoesNotExist:
        return JsonResponse({'error': 'Task not found'}, status=404)
    except Exception as e:
        print(e)
   

def updateTask(request, pk):
    if request.method == 'POST':
        try:
            task_title = request.POST.get('title')
            duration = datetime.fromisoformat(request.POST.get('duration'))
            description = request.POST.get('description')
            update_task = Task.objects.get(id=pk)
            update_task.title = task_title
            update_task.duration = timezone.make_aware(duration)
            update_task.description = description
            update_task.save()
            messages.success(request, 'Task was successfully updated!')
        except Exception as e:
            messages.error(request, 'Error. Task was not updated!')
            print(e)
    return redirect('/')


def markTask(request, pk):
    if request.method == 'POST':
        try:
            task = Task.objects.get(id=pk)
            if request.body.decode() == 'true':
                task.complete = True
                task.save()
            elif request.body.decode() == 'false':
                task.complete = False
                task.save()
            else:
                raise Exception('Could not get data from body!')
        except Exception as e:
            print(e)
            return JsonResponse({'success':False})
    return JsonResponse({'success':True})


def deleteTask(request, pk):
    if request.method == 'DELETE':
        try:
            task = Task.objects.get(id=pk)
            task.delete()
            messages.success(request, 'Task was successfully deleted!')
        except Exception as e:
            messages.error(request, 'Error. Task was not deleted!')
            print(e)
            return JsonResponse({'success':False})
    return JsonResponse({'success':True})