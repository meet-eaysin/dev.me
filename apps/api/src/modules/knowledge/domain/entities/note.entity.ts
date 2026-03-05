export interface NotePublicView {
  id: string;
  userId: string;
  documentId?: string | undefined;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteEntityProps {
  id: string;
  userId: string;
  documentId?: string | undefined;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NoteEntity {
  constructor(public readonly props: NoteEntityProps) {}

  static create(props: NoteEntityProps): NoteEntity {
    return new NoteEntity(props);
  }

  toPublicView(): NotePublicView {
    return {
      id: this.props.id,
      userId: this.props.userId,
      documentId: this.props.documentId,
      content: this.props.content,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  get id(): string {
    return this.props.id;
  }
}
