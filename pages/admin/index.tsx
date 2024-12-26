import { useEffect, useState } from "react";
import { supabase, Form } from "../../utils/supabase";
import Link from "next/link";
import { withAuth } from "../../utils/withAuth";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Plus, LogOut, ExternalLink, Edit2, Loader2 } from "lucide-react";
import { useRouter } from "next/router";

function AdminPage() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setForms(data || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black admin-page">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Forms Dashboard
            </h1>
            <p className="text-xl text-gray-400">Manage your forms with ease</p>
          </div>
          <Button
            onClick={() => router.push("/admin/forms/new")}
            className="text-lg h-12 px-8"
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Form
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          </div>
        ) : forms.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center h-96">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">
                  No forms yet
                </h3>
                <p className="text-lg text-gray-400 mb-8">
                  Create your first form to get started
                </p>
                <Button
                  size="lg"
                  className="text-base"
                  onClick={() => router.push("/admin/forms/new")}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create New Form
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <Card key={form.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-white mb-2">
                    {form.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-400">
                    {form.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-base text-gray-400">
                      Created: {new Date(form.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-4">
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="flex-1 text-base"
                      >
                        <Link href={`/admin/forms/${form.id}`}>
                          <Edit2 className="mr-2 h-5 w-5" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="flex-1 text-base"
                      >
                        <Link href={`/f/${form.permalink}`} target="_blank">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(AdminPage);
