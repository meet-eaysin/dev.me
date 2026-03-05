export interface FolderPublicView {
  id: string;
  userId: string;
  parentId?: string | undefined;
  name: string;
  description?: string | undefined;
  color?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderEntityProps {
  id: string;
  userId: string;
  parentId?: string | null | undefined;
  name: string;
  description?: string | undefined;
  color?: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class FolderEntity {
  constructor(public readonly props: FolderEntityProps) {}

  static create(props: FolderEntityProps): FolderEntity {
    return new FolderEntity(props);
  }

  toPublicView(): FolderPublicView {
    return {
      id: this.props.id,
      userId: this.props.userId,
      parentId: this.props.parentId ?? undefined,
      name: this.props.name,
      description: this.props.description,
      color: this.props.color,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  get id(): string {
    return this.props.id;
  }
}
