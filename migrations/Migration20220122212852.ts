import { Migration } from '@mikro-orm/migrations';

export class Migration20220122212852 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "poll_entity" ("id" varchar(255) not null, "title" varchar(255) not null);');
    this.addSql('alter table "poll_entity" add constraint "poll_entity_pkey" primary key ("id");');

    this.addSql('create table "poll_option_entity" ("id" varchar(255) not null, "value" varchar(255) not null, "type" varchar(255) not null, "poll_id" varchar(255) not null);');
    this.addSql('alter table "poll_option_entity" add constraint "poll_option_entity_pkey" primary key ("id");');

    this.addSql('alter table "poll_option_entity" add constraint "poll_option_entity_poll_id_foreign" foreign key ("poll_id") references "poll_entity" ("id") on update cascade;');
  }

}
