export interface TagPublicView {
  id: string;
  userId: string;
  name: string;
  source?: string | undefined;
  color?: string | undefined;
  createdAt: Date;
}

export interface TagEntityProps {
  id: string;
  userId: string;
  name: string;
  source?: string | undefined;
  color?: string | undefined;
  createdAt: Date;
}

export class TagEntity {
  constructor(public readonly props: TagEntityProps) {}

  static create(props: TagEntityProps): TagEntity {
    return new TagEntity(props);
  }

  toPublicView(): TagPublicView {
    return {
      id: this.props.id,
      userId: this.props.userId,
      name: this.props.name,
      source: this.props.source,
      color: this.props.color,
      createdAt: this.props.createdAt,
    };
  }

  get id(): string {
    return this.props.id;
  }
  get name(): string {
    return this.props.name;
  }
}
