from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
# from  also.models import Project,Category,Page
from also.models import *
from django.db.models import Q
from django.conf import settings

import requests
import json
from datetime import datetime
import random
import time

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
def newHome(request):
	if(request.mobile):
		return render_to_response('mobile/index.html',{"none":"None"})

	contact = Article.objects.get(slug = 'contact').textFields.all()

	return render_to_response('newIndex.html',{"contact":contact,"MEDIA_URL":settings.MEDIA_URL})

def newWork(request):
	articles = Article.objects.all().order_by('-date').filter(category = Category.objects.all().filter(slug="work")[0])
	artList = []
	for article in articles:
		artObj = {"title":article.title,"slug":article.slug,article.slug:"yep",
				"text":getTexts(article.textFields.all().order_by('-date')),
				"image":getImages(article.imageFields.all().order_by('order'))}
		artList.append(artObj);

	response_data = {"articles":artList,"MEDIA_URL":settings.MEDIA_URL}
	return render_to_response('newWork.html',response_data)	

def newAbout(request):
	articles = Article.objects.all().order_by('-date').filter(category = Category.objects.all().filter(slug="about")[0])
	artList = []
	for article in articles:
		artObj = {"title":article.title,"slug":article.slug,article.slug:"yep",
				"text":getTexts(article.textFields.all().order_by('-date')),
				"image":getImages(article.imageFields.all().order_by('order'))}
		artList.append(artObj);

	response_data = {"articles":artList,"MEDIA_URL":settings.MEDIA_URL}
		
	return render_to_response('newAbout.html',response_data)		

def newProcess(request):
	posts = InstaPost.objects.all().order_by('-date')
	return render_to_response('newInsta.html',{"posts":posts,"MEDIA_URL":settings.MEDIA_URL})

def home(request):
	getNewInstaPost()
	if(request.mobile):
		return render_to_response('mobile/index.html',{"none":"None"})

	categories = Category.objects.all()
	rootArticles = Article.objects.all().order_by('-date')
	#print dir(categories)
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
	print json.dumps(textList)
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
		current = {"prev":False,"MEDIA_URL":settings.MEDIA_URL}
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

	return render_to_response("mobile/work.html",{"projects":projectData,"current":current,"MEDIA_URL":settings.MEDIA_URL})

def mAboutData(request):
	articles = Article.objects.all()
	bios = articles.filter(slug = "people")[0].textFields.all().order_by('-date')
	people = getListofPeople(bios[1:])

	response_data = {"bio":bios[0].textField,
					"contact":getTexts(articles.filter(title = "Contact")[0].textFields.all())[0]["text"],
					"awards":getTexts(articles.filter(title = "Awards")[0].textFields.all())[0]["text"],
					"people":people,"MEDIA_URL":settings.MEDIA_URL
	}
	return render_to_response("mobile/about.html",response_data)

def getListofPeople(people):
	pepOut = []
	for person in range(0,len(people),2):
		pepOut.append(({"name":onlyBeforBr(people[person].title),"slug":people[person].slug},
			{"name":onlyBeforBr(people[person+1].title),"slug":people[person+1].slug}))

	return pepOut

def onlyBeforBr(input):
	return input[:input.find("<")]

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

def mPersons(request, person = None):
	personData = Article.objects.get(slug = "people").textFields.all().order_by('-date')#get(slug = person)
	prev = None
	current = None
	next = None
	for per in personData:
		if(current):
			next = per
			out = {	"name":current.title.replace("<br/>"," "),
					"bio":current.textField,
					"bkimg":getImages(current.backgroundImage.all())[0]["title"],
					"prev":prev.slug,
					"next":next.slug,
					"MEDIA_URL":settings.MEDIA_URL
					}
			return render_to_response('mobile/person.html',out)

		if(per.slug == person):
			current = per
		else:
			prev = per
	out = {	"name":current.title,
			"bio":current.textField,
			"bkimg":getImages(current.backgroundImage.all())[0]["title"],
			"prev":prev.slug,
			"MEDIA_URL":settings.MEDIA_URL
			}
	return render_to_response('mobile/person.html',out)

def pureData(request):
	return render_to_response('basic.html',{"nothing":"out"})

def getNewInstaPost():
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
				break
		if isItNew:
			if image["caption"]:
				text = image["caption"]["text"]
				user = image["caption"]["from"]["username"]
				unixtimestamp = int(image["created_time"])
				normalTS = datetime.fromtimestamp(unixtimestamp).strftime('%Y-%m-%d %H:%M:%S')
				newImage = InstaPost.objects.create(message = text,url = link,date = normalTS,creator = user)
				newImage.save()
				instaArticle.instagramFields.add(newImage)

	instaArticle.save()

def allData(request):
	getNewInstaPost()
	if(request.mobile):
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

	# allContent.update({"firstSlide":"RLine"})#"days":days,#listOfSlides[random.randint(0,len(listOfSlides)-1)]})
	return render_to_response('index-other.html',{'allContent':allContent})




def simplework(request,project = None):
	if(project == None):
		return False
	if project:
		pro = Article.objects.all().order_by('-date').filter(slug = project)[0]
		print project
		current = {
					"title":pro.title,"slug":pro.slug,
					"text":getTexts(pro.textFields.all().order_by('-date')),
					"image":getImages(pro.imageFields.all().order_by('order'))
					}
	else:
		current = False

	return render_to_response("simpleTemplate.html",{"current":current})

def simpleworklist(request):
	categories = Category.objects.all()
	archive = categories.filter(slug = "archive")
	work = categories.filter(slug = "work")

	articles = Article.objects.all().order_by('-date').filter(category = work )

	archivelist = Article.objects.all().order_by('-date').filter(category = archive )

	current = [{"title":"thisTitle","link":"thisLink"}]

	return render_to_response("archivelist.html",{"current":articles,"archived":archivelist})

def sitemap(request):
	categories = Category.objects.all()	
	archive = categories.filter(slug = "archive")
	work = categories.filter(slug = "work")
	about = categories.filter(slug = "about")

	projects = Article.objects.all().order_by('-date').filter(category = work)
	archives = Article.objects.all().order_by('-date').filter(Q(category = work)|Q(category = archive))
	about = Article.objects.all().order_by('-date').filter(category = about)

	return render_to_response("sitemap.xml",{"projects":projects,"about":about,'archives':archives},content_type="application/xhtml+xml")
