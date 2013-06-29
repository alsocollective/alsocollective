from django.contrib import admin
from ALSO.models import ImageNode, TextNode, Category, Article, InstaPost, Post, Day

# class ProjectAdmin(admin.ModelAdmin):
# 	fields = ['title','content']

# class CategoryAdmin(admin.ModelAdmin):
# 	fieldsets = [
# 		('title',{'fields':['title']}),
# 		('content',{'fields':['projects','pages']}),
# 	]

class ArticleAdmin(admin.ModelAdmin):
	list_display = ('title', 'date')
	filter_horizontal = ('textFields','imageFields','instagramFields',)

	fieldsets = [
		(None,{'fields':['title','category','date','textFields','imageFields']}),
		('Advance options', {
			'classes':('collapse',),
			'fields':('instagramFields','slug',)
			}),
	]

class Image(admin.ModelAdmin):
	list_display = ('title', 'order','admin_image','admin_video')
	fieldsets = [
		(None,{'fields':['location','video','url','order']}),
		('Advance options', {
			'classes':('collapse',),
			'fields':('description','title')
			}),
	]

class TextAdmin(admin.ModelAdmin):
	list_display = ('title', 'date')


admin.site.register(ImageNode,Image)
admin.site.register(TextNode,TextAdmin)
admin.site.register(Category)
admin.site.register(Article,ArticleAdmin)
admin.site.register(InstaPost)
admin.site.register(Post)
# admin.site.register(Day)
