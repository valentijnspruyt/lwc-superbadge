public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts()
    {
        throw new AuraHandledException('Test');
        //return [SELECT FirstName, LastName, Email from Contact];
    }
}
