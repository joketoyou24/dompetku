"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getInitials } from "@/lib/utils";
import { updateProfile } from "@/actions/profile";

export function ProfileForm({
  name,
  email,
  image,
  currency,
}: {
  name: string;
  email: string;
  image: string | null;
  currency: string;
}) {
  const [nameVal, setNameVal] = useState(name);
  const [imageVal, setImageVal] = useState(image ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name: nameVal, image: imageVal, currency });
      toast.success("Profil berhasil diperbarui");
    } catch (err: any) {
      toast.error(err.message ?? "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun kamu di DompetKu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={imageVal || undefined} alt={nameVal} />
                <AvatarFallback className="text-lg">{getInitials(nameVal)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5">
                <Label>URL Foto Profil</Label>
                <Input
                  placeholder="https://..."
                  value={imageVal}
                  onChange={(e) => setImageVal(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Nama</Label>
              <Input value={nameVal} onChange={(e) => setNameVal(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={email} disabled />
            </div>

            <div className="space-y-1.5">
              <Label>Mata Uang</Label>
              <Input value="IDR (Rupiah Indonesia)" disabled />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tampilan</CardTitle>
          <CardDescription>Pilih mode terang atau gelap.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm">Mode Gelap</span>
          <ThemeToggle />
        </CardContent>
      </Card>
    </div>
  );
}
