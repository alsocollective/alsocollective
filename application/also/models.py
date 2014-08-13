from django.db import models
from django.template.defaultfilters import slugify
import os
import os.path

def touch(path):
    with open(path, 'a'):
        os.utime(path, None)

class ImageNode(models.Model):
	description = models.CharField(max_length=300, blank=True)

	def slugify_filename(instance, filename):
		fname, dot, extension = filename.rpartition('.')
		slug = slugify(fname)
		instance.title = '%s.%s' % (slug, extension)
		# path = '/srv/www/alsocollective.com/public_html/alsocollectivedev/alsocollective/static/upload/'
		# print os.path.exists(path)
		# print "test for Director write persmission"
		# print os.access(path, os.W_OK)
		# touch(path+"bohdan-was-here.text")


		# return '/srv/www/also-static.com/static/alsocollective/upload/%s.%s' % (slug, extension)
		return '/srv/www/alsocollective.com/public_html/alsocollective/static/img/uploaded/%s.%s' % (slug, extension)
		# return '/srv/www/alsocollective.com/public_html/alsocollectivedev/alsocollective/static/upload/%s.%s' % (slug, extension)



	location = models.FileField(upload_to=slugify_filename)

	# def titleName(this):
	# 	out = os.path.basename(self.location.name)
	# 	if(not out):
	# 		out = "you don't need to enter a title"
	# 	return out

	title = models.CharField(max_length=600,blank=True)#,default=titleName)
	video = models.URLField(max_length=1000, blank=True);
	url = models.URLField(max_length=1000, blank=True);
	date = models.DateField(auto_now=False,blank=True,null=True)
	order = models.IntegerField(blank=True,default=0)

	def save(self, *args, **kwargs):
		self.title = os.path.basename(self.location.name)
		super(ImageNode, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.title

	def admin_image(self):
		if self.title:
			# return '<img style="width:200px;height:auto;" src="/static/img/uploaded/%s"/>' % self.title
			return '<img style="width:200px;height:auto;" src="http://www.also-static.com/alsocollective/uploaded/%s"/>' % self.title
		return "not an image"
	admin_image.allow_tags = True

	def admin_video(self):
		if self.video:
			return '<iframe src="%s?title=0&amp;byline=0&amp;portrait=0&amp;color=ff0179" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>' % self.video
		return "not an video"
	admin_video.allow_tags = True

class TextNode(models.Model):
	title = models.CharField(max_length=600)
	backgroundImage = models.ManyToManyField(ImageNode, blank=True, related_name="bkImage+")
	textField = models.TextField(max_length=4000)
	date = models.DateField(auto_now=False,blank=True,null=True)
	slug = models.SlugField(blank=True)

	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(TextNode, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.title

class InstaPost(models.Model):
	message = models.CharField(max_length=1000)
	url = models.URLField(max_length=1000)
	date = models.DateTimeField(auto_now=False)
	creator = models.CharField(max_length=300)
	display = models.BooleanField(blank = True, default=True)
	def instaImage(self):
		if self.url:
			return '<img style="width:200px;height:auto;" src="%s"/>' % self.url
		return "not an image"
	instaImage.allow_tags = True

class Category(models.Model):
	title = models.CharField(max_length=600)
	slug = models.SlugField(blank=True)
	##if left blank have it display all
	toDisplay = models.IntegerField(blank=True,default=0)
	description = models.ForeignKey(TextNode,blank=True,null=True)

	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(Category, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.title

class Article(models.Model):
	title = models.CharField(max_length=600)
	textFields = models.ManyToManyField(TextNode,blank=True,related_name="textFields+")
	imageFields = models.ManyToManyField(ImageNode,blank=True,related_name="imageFields+")
	instagramFields = models.ManyToManyField(InstaPost,blank=True,related_name="instFields+")
	category = models.ManyToManyField(Category,related_name="category+")
	## could add to the save function so it affects the others articles of the same class
	order = models.IntegerField(blank=True,default=0)
	slug = models.SlugField(blank=True)

	def save(self,*args, **kwargs):
		self.slug = slugify(self.title)
		super(Article, self).save(*args, **kwargs)

	def showCat(self):
		return self.category.all()[0].title

	def __unicode__(self):
		return self.title

	date = models.DateField(auto_now=False)
postTypes = (
	('tweet','tweet'),
	('article','article'),
	('blogPost','blogPost'),
	('music','music')
)



class Post(models.Model):
	##for tweets
	text = models.TextField(max_length=4000, blank=True)
	creator = models.CharField(max_length= 200, blank=True)
	#date = models.DateTimeField(auto_now=True)

	##articles
	url = models.URLField(max_length=1000, blank=True)
	image = models.ManyToManyField(ImageNode,blank=True,related_name="image+")
	title = models.CharField(max_length=600, blank=True,default="none")
	slug = models.SlugField(blank=True)

	postType = models.CharField(max_length=20, choices=postTypes)
	date = models.DateField(auto_now=False,blank=True,null=True)

	def save(self,*args, **kwargs):
		# if(self.postType == "tweet"):
		# 	self.title = "tweet"
		self.slug = slugify(self.title)
		super(Post, self).save(*args, **kwargs)

	def __unicode__(self):
		return self.title


class Day(models.Model):
	date = models.DateField(auto_now=False)
	posts = models.ManyToManyField(Post,blank=True,related_name="posts+")

	instagramFields = models.ManyToManyField(InstaPost,blank=True,related_name="instaDay+")

	def __unicode__(self):
		return self.date.strftime('%Y-%m-%d')



