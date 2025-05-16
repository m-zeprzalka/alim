-- SQL zapytanie do sprawdzenia zawartości tabeli FormSubmission
SELECT 
  f."id",
  f."emailSubscriptionId", 
  f."status",
  f."rodzajSaduSad",
  f."apelacjaSad", 
  f."sadOkregowyId",
  f."rokDecyzjiSad",
  f."watekWiny",
  f."formData"->'rodzajSaduSad' as "formData_rodzajSaduSad",
  f."formData"->'apelacjaSad' as "formData_apelacjaSad", 
  f."formData"->'sadOkregowyId' as "formData_sadOkregowyId",
  f."formData"->'rokDecyzjiSad' as "formData_rokDecyzjiSad",
  f."formData"->'watekWiny' as "formData_watekWiny",
  e."email"
FROM "FormSubmission" f
JOIN "EmailSubscription" e ON f."emailSubscriptionId" = e."id";
