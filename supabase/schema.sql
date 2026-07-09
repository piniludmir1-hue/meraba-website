create table if not exists public.cms_documents (
  path text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.cms_media (
  path text primary key,
  storage_bucket text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text,
  size_bytes bigint,
  updated_at timestamptz not null default now()
);

create index if not exists cms_documents_updated_at_idx on public.cms_documents (updated_at desc);
create index if not exists cms_media_updated_at_idx on public.cms_media (updated_at desc);

alter table public.cms_documents enable row level security;
alter table public.cms_media enable row level security;

drop policy if exists "cms_documents_server_only" on public.cms_documents;
drop policy if exists "cms_media_server_only" on public.cms_media;

create policy "cms_documents_server_only"
on public.cms_documents
for all
using (false)
with check (false);

create policy "cms_media_server_only"
on public.cms_media
for all
using (false)
with check (false);

insert into storage.buckets (id, name, public)
values ('meraba-uploads', 'meraba-uploads', true)
on conflict (id) do update set public = excluded.public;
