from django.urls import path
from .import views


urlpatterns = [
    path('', views.main, name='main'),
    path('<str:filter>', views.main, name='task'),
    path('<str:filter>', views.main, name="filtered_tasks"),
    path('add_task/', views.addTask, name='add_task'),
    path('update_task/<str:pk>', views.updateTask, name='update_task'),
    path('get_task_data/<str:pk>', views.getTaskData, name='get_task_data'),
    path('mark_task/<str:pk>', views.markTask, name='mark_task'),
    path('delete_task/<str:pk>', views.deleteTask, name='delete_task'),
]