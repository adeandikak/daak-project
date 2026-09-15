import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PengumumanModule } from './rest/pengumuman/pengumuman.module';
import { StatistikModule } from './rest/statistik/statistik.module';
import { BeritaModule } from './rest/berita/berita.module';
import { DasborModule } from './rest/dasbor/dasbor.module';

/* Satu tempat mendaftarkan modul. Modul domain baru ditambahkan di sini,
   urut mengikuti nomor migrasinya supaya ketergantungan antar modul terbaca
   dari urutan daftarnya.

   Template juga menyertakan UsersModule, RolesModule, MenuModule,
   PermissionsModule, dan InstansiModule. Portal DAAK baru memerlukan login
   staf, jadi lapisan RBAC penuh itu belum dipasang — lihat docs/PANDUAN.md. */
@Module({
  imports: [
    AuthModule,
    PengumumanModule,
    StatistikModule,
    BeritaModule,
    DasborModule,
  ],
})
export class V1Module {}
