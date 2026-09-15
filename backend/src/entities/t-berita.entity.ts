import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('t_berita')
export class TBeritaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_berita_slug', { unique: true })
  @Column({ length: 160 })
  slug: string;

  @Column({ length: 255 })
  judul: string;

  @Column({ type: 'text' })
  ringkasan: string;

  @Column({ type: 'date' })
  tanggal: string;

  @Index('idx_berita_kategori')
  @Column({ length: 60 })
  kategori: string;

  /* Thumbnail design system DAAK berupa gradien + ikon, bukan foto.
     `ikon` menyimpan NAMA ikon (mis. 'box'), bukan markup SVG — pemetaan
     nama ke komponen ada di FE src/utils/icons.ts. Menyimpan markup di
     basis data berarti menaruh urusan tampilan di tempat yang salah. */
  @Column({ length: 9 })
  gradient_from: string;

  @Column({ length: 9 })
  gradient_to: string;

  @Column({ length: 40, default: 'file-text' })
  ikon: string;

  @Column({ length: 255 })
  tautan_url: string;

  @Index('idx_berita_terbit')
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
