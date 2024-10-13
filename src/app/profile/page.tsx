'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from 'lucide-react';

interface User {
  name?: string;
  email?: string;
  image?: string;
  teamNumber?: number;
  role?: 'employee' | 'admin' | 'manager';
  department?: string;
  existingSkills: string[];
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/getUser');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Retrieving your details...</p>
        </div>
      ) : !user ? (
        <div className="text-center text-lg text-muted-foreground">User not found.</div>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name || 'Anonymous User'}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Team Number" value={user.teamNumber?.toString() || 'N/A'} />
              <InfoItem label="Role" value={capitalizeFirstLetter(user.role) || 'N/A'} />
              <InfoItem label="Department" value={user.department || 'N/A'} />
              <div className="col-span-2">
                <h3 className="font-semibold mb-2">Existing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.existingSkills.length > 0 ? (
                    user.existingSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h3 className="font-semibold">{label}</h3>
    <p className="text-muted-foreground">{value}</p>
  </div>
);

function capitalizeFirstLetter(word?: string): string {
  if (!word) return 'N/A';
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default Profile;