import zipfile
import json
import os
import io

from django.shortcuts import render
from django.http import HttpResponse, FileResponse
import googleapiclient.discovery
from yt_dlp import YoutubeDL


def home(request):
    return render(request, 'downloader/index.html')

def getVideoData(request):
    api = googleapiclient.discovery.build(
        'youtube', 'v3', developerKey='AIzaSyDYf1qOlYWciGbQcjbK9IPmkwpn0B3PwG4'
    )
    request = api.search().list(
        part = 'snippet',
        q = request.GET['q']
    )
    response = request.execute()
    return HttpResponse(json.dumps(response))

def getVideo(request):
    ids = request.GET['q'].split()
    fmt = request.GET['fmt']
    print(ids)
    ytdl_opts = {
        'format': f'{fmt}/bestaudio',
        'noplaylist': True,
        'nocheckcertificate': True,
        'outtmpl': f'./media/%(title)s.{fmt}',
    }

    downloader = YoutubeDL(ytdl_opts)

    if len(ids) == 1:
        info = downloader.extract_info(ids[0])
        filename = downloader.prepare_filename(info)
        with open(filename, 'rb') as file:
            file_bytes = io.BytesIO(file.read())
        os.remove(filename)
        return FileResponse(file_bytes, as_attachment=True, filename=info['title']+f'.{fmt}')
    else:
        zip_bytes = io.BytesIO()
        with zipfile.ZipFile(zip_bytes, 'w') as zip:
            for vid_id in ids:        
                info = downloader.extract_info(vid_id)
                filename = downloader.prepare_filename(info)
                zip.write(filename)
                os.remove(filename)
        zip_bytes.seek(0)
        return FileResponse(zip_bytes, as_attachment=True, filename='youtubedl.zip')
    