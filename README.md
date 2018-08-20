#An Explorer For ActivityPub
This is an explorer for activity-pub-objects. It's main function is to validate ActivityPub-objects.

##Specification
The specifications were implemented according to the [W3 activitystreams vocabulary](https://www.w3.org/TR/activitystreams-vocabulary/#types) as well as possible. I'm e.g. not sure how a false "Functional"-description should be interpreted.

##Validation
[jsonschema](https://github.com/tdegrunt/jsonschema) is used to validate an object against a set schema. This implies that only complete objects are validated! Once objects are referenced via link (as string or actual 'Link'-object), validation stops there.

##Exploration
The idea is to fetch an object, identify links, and enable a user to go through these links to a.) explore and b.) validate the structure.

##Todo:
 * Implement exploration (Coming soon)
 * Implement basic webfinger exploration/validation
 * Look for leading "@context"-attribute
 * Nice design (if remaining time.)