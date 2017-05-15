# AccommoData

##GA WDI London - Project 4(Final Project)

###Sharing Recommendations

#####About

Pylon 2.0 has a full stack RESTful frontend, and uses Rails API for the backend. A reccommendations site, pivoting on map functionality. User's choose their community and can easily store and share their recommendations. 

#####[View it here!](https://radiant-bastion-75576.herokuapp.com/)

![](./public/images/home.png)

![](./public/images/users.png)

#####How it Works

Once registered and logged in, users can add reccommendations to their map. These are then also shared on a public feed, however only users that follow them can see their submissions. If a user owns a reccommendation they can edit it's comments and category. Otherwise they can pin a reccommendation to their map from the feed, or pin *and* repost it to the feed. User's select their community by choosing who they follow so they only see submissions from those they trust.

![](./public/images/feed.png)

From the profile page users can filter by which pylons they see (theirs, their friends, or all user Pylons), and by category. If more than one user as submitted the same recommendation this is shown by a number on the map marker. When clicked on, a marker displays information about that place (name, address, telephone number, and website) as well as any comments users have made (again, filtered by relationship to user).

![](./public/images/profile.png)

#####Build

* JavaScript, Express, Node.js, AngularJS, HTML5, CSS, SASS, Bootstrap were used to create the frontend application.
* Ruby, Ruby on Rails and PostgreSQL database in the backend.
* Pictures are base64 encoded and stored using the AWS S3 service.
* Authentication uses JWT with Satellizer and BCrypt.
* The Google Web Font 'PJosefin Sans' has been used to style the application.

#####Future Additions

I would like to change it so that on a user's profile instead of seeing 'All Pylons', i.e. all Pylons ever pinned, they can see Pylons of those they don't follow but who are connected to those that they do-a kind of mutual friends relationship. I would also like to work on the way information is displayed on marker click. 

#####Problems & Challenges

Building the following relationships, and manipulating data based on those was certainly the greatest challenge. I do not like some of the user experience decisions I had to go with when up against the clock, so I will certainly revisit that.










