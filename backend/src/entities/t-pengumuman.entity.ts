import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/* Awalan `t_` = tabel transaksi (isinya bertambah seiring waktu).
   Nama tabel dan kolom snake_case dan tunggal. Kolom audit lengkap,
   `deleted_at` karena pengumuman diarsipkan, bukan dihapus permanen.
   Status disimpan sebagai varchar + CHECK di migrasi, bukan enum Postgres —
   enum menyulitkan penambahan nilai. */
@Entity('t_pengumuman')
export class TPengumumanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  judul: string;

  @Column({ type: 'date' })
  tanggal: string;

  // penting | baru | update — dibatasi CHECK di migrasi 001
  @Index('idx_pengumuman_status')
  @Column({ length: 20, default: 'baru' })
  status: string;

  @Column({ type: 'text' })
  isi: string;

  // Tombol di dalam panel accordion. Kosong = panel tanpa tombol.
  @Column({ length: 100, nullable: true })
  cta_label: string | null;

  @Column({ length: 255, nullable: true })
  cta_url: string | null;

  @Index('idx_pengumuman_terbit')
  @Column({ default: true })
  is_published: boolean;

  @Column({ length: 100, nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ length: 100, nullable: true })
  updated_by: string;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
