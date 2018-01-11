class AvailabilityController < ApplicationController

	def index

	# get token

	  data = {'username' => 'mentors@codecademy.com','password' => 'c0decademym3ntors'}				# hide this in environmental variables, of course

	  uri = URI.parse("https://api.wheniwork.com/2/login/")
	  http = Net::HTTP.new(uri.host, uri.port)
	  http.use_ssl = true
	  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
	  request = Net::HTTP::Post.new(uri.path)
	  request.add_field('W-Key', '652a9a4d16a9b8ef71f2830470a5b8c446703dd3')
	  request.body = data.to_json
	  response = http.request(request)

	  token = JSON.parse(response.body)["token"]

	  
	  
	# get all users with a project review 

	  uri = URI.parse("https://api.wheniwork.com/2/users")
	  http = Net::HTTP.new(uri.host, uri.port)
	  http.use_ssl = true
	  http.verify_mode = OpenSSL::SSL::VERIFY_NONE
	  request = Net::HTTP::Get.new(uri.path)
	  request.add_field('W-Token', token)
	  request.body = data.to_json
	  users = http.request(request)

	  @response = users.body

	  # position 5842635 is project reviewer. Iterate through the users, create an array of only project reviewers

	  users.body.map {|}


	end
end
