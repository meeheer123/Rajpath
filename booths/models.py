from django.db import models

class District(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class AssemblyConstituency(models.Model):
    name = models.CharField(max_length=100)
    district = models.ForeignKey(District, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class VotingBooth(models.Model):
    location_name = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    assembly_constituency = models.ForeignKey(AssemblyConstituency, on_delete=models.CASCADE)

    def __str__(self):
        return self.location_name

class User(models.Model):
    name = models.CharField(max_length=100)
    voter_id = models.CharField(max_length=20, unique=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    assembly_constituency = models.ForeignKey(AssemblyConstituency, on_delete=models.CASCADE)
