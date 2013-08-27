from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
# from  also.models import Project,Category,Page
from also.models import *



import requests
import json
from datetime import datetime
import random


##functions
def getTexts(listin):
	textList = []
	for text in listin:
		textObj = {"text":text.textField,"title":text.title}
		for image in text.backgroundImage.all():
			textObj.update({"bkImage":image.title})
		textList.append(textObj)
	return textList

def getImages(listin):
	imageList = []
	for image in listin:
		imageObj = {"title":image.title}
		if image.video:
			imageObj.update({"link":image.video})
		imageList.append(imageObj)
	return imageList

def getInstagram(listin):
	instaList = []
	for i in xrange(0,len(listin)-2,2):
		subList = ({"message":listin[i].message,
					"url":listin[i].url,
					"date":listin[i].date.strftime('%Y-%m-%d %H:%M:%S'),
					"creator":listin[i].creator},{"message":listin[i+1].message,
					"url":listin[i+1].url,
					"date":listin[i+1].date.strftime('%Y-%m-%d %H:%M:%S'),
					"creator":listin[i+1].creator})
		instaList.append(subList)
	return instaList


##Desktop Main request
def home(request):
	if(True):#not request.mobile):
		return render_to_response('mobile/index.html',{"none":"None"})

	categories = Category.objects.all()
	rootArticles = Article.objects.all().order_by('-date')

	allContent = {}
	for category in categories:
		catObj = {"cat":category,"description":category.description.textField}
		articles = rootArticles.filter(category__exact = category)
		artList = []
		for article in articles:
			## initialze Category
			artObj = {"title":article.title,"slug":article.slug,article.slug:"yep",
					"text":getTexts(article.textFields.all().order_by('-date')),
					"image":getImages(article.imageFields.all().order_by('order')),
					"insta":getInstagram(article.instagramFields.filter(display = True).all().order_by('-date'))
					}

			artList.append(artObj)
		catObj.update({"artList":artList})
		allContent.update({category.title:catObj})

	allContent.update({"firstSlide":"RLine"})#"days":days,#listOfSlides[random.randint(0,len(listOfSlides)-1)]})

	return render_to_response('index.html',{'allContent':allContent})

#Desktop sup requests
def workData(request):
	articles = Article.objects.all().order_by('-date').filter(category = Category.objects.all().filter(slug="work")[0])
	artList = []
	for article in articles:
		artObj = {"title":article.title,"slug":article.slug,article.slug:"yep",
				"image":getImages(article.imageFields.all().order_by('order'))}
		artList.append(artObj);

	response_data = {"articles":artList}
	return HttpResponse(json.dumps(response_data), mimetype="application/json")

def aboutData(request):
	article = Article.objects.all().filter(slug = "people")[0]
	artObj = {"title":article.title,"slug":article.slug,article.slug:"yep"}

	textList = []
	for text in article.textFields.all().order_by('-date'):
		textObj = {"title":text.title}
		for image in text.backgroundImage.all():
			textObj.update({"bkImage":image.title})
		textList.append(textObj)

	response_data = {"articles":textList}
	return HttpResponse(json.dumps(textList), mimetype="application/json")

def instaData(request):
	article = Article.objects.all().filter(slug = "instagram")[0]
	artObj = {"title":article.title,"slug":article.slug,article.slug:"yep"}
	print article.textFields.all()
	print article.imageFields.all()

	instaList = []
	allInstaPosts = article.instagramFields.all().order_by('-date')
	for i in xrange(0,len(allInstaPosts)-2,2):
		subList = ({"message":allInstaPosts[i].message,
					"url":allInstaPosts[i].url,
					"url":allInstaPosts[i+1].url})
		instaList.append(subList)

	return HttpResponse(json.dumps(instaList), mimetype="application/json")


##Mobile Requests
def mWorkData(request,project = None):
	articles = Article.objects.all().order_by('-date').filter(category = Category.objects.all().filter(slug="work"))

	if project:
		# projectObject = articles.filter(slug = project)[0]
		current = {"prev":False}
		found = False
		for pro in articles:
			if(found):
				current.update({"next":pro.slug,"nextT":pro.title})
				return render_to_response("mobile/project.html",current);

			if(pro.slug == project):
				current.update({"title":pro.title,"slug":pro.slug,
					"text":getTexts(pro.textFields.all().order_by('-date')),
					"image":getImages(pro.imageFields.all().order_by('order'))})
				found = True
			else:
				current.update({"prev":pro.slug,"prevT":pro.title})
		if(found):
			current.update({"next":False})
			return render_to_response("mobile/project.html",current);
	else:
		current = False

	projectData = []
	for pro in articles:
		projectData.append({"title":pro.title,"slug":pro.slug,
				"text":getTexts(pro.textFields.all().order_by('-date')),
				"image":getImages(pro.imageFields.all().order_by('order'))})

	return render_to_response("mobile/work.html",{"projects":projectData,"current":current})

def mAboutData(request):
	articles = Article.objects.all()

	response_data = {"bio":articles.filter(slug = "people")[0].textFields.all().order_by('-date')[0].textField,
					"contact":getTexts(articles.filter(title = "Contact")[0].textFields.all())[0]["text"],
					"awards":getTexts(articles.filter(title = "Awards")[0].textFields.all())[0]["text"],
	}
	return render_to_response("mobile/about.html",response_data)

def mInstaData(request):
	article = Article.objects.all().filter(slug = "instagram")[0]
	artObj = {"title":article.title,"slug":article.slug,article.slug:"yep"}
	print article.textFields.all()
	print article.imageFields.all()

	instaList = []
	allInstaPosts = article.instagramFields.all().order_by('-date')
	for i in xrange(0,len(allInstaPosts)-2,2):
		subList = ({"message":allInstaPosts[i].message,
					"url":allInstaPosts[i].url,
					"url":allInstaPosts[i+1].url})
		instaList.append(subList)
	return render_to_response("mobile/process.html",instaList)


def pureData(request):
	return render_to_response('basic.html',{"nothing":"out"})

def getNewInstaPost(request):
	tag = "AlsoCollective"
	address = "https://api.instagram.com/v1/tags/%s/media/recent?client_id=f6f99af9459c462d90e826d5893b61f7"%tag
	data = json.loads(requests.get(address).content)
	allInstaPosts = InstaPost.objects.all()
	instaArticle = Article.objects.filter(title="Instagram")[0]

	for image in data["data"]:
		isItNew = True
		link = image["images"]["standard_resolution"]["url"]

		for instance in allInstaPosts:
			if instance.url == link:
				isItNew = False
				print "it's old"
				break
		if isItNew:
			print "new %s" %link
			if image["caption"]:
				text = image["caption"]["text"]
				user = image["caption"]["from"]["username"]
				unixtimestamp = int(image["created_time"])
				normalTS = datetime.fromtimestamp(unixtimestamp).strftime('%Y-%m-%d %H:%M:%S')
				newImage = InstaPost.objects.create(message = text,url = link,date = normalTS,creator = user)
				newImage.save()
				instaArticle.instagramFields.add(newImage)

	instaArticle.save()
	return render_to_response('basic.html',{"nothing":"out"})

