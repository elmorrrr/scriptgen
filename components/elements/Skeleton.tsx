type Props = {
  image: boolean;
  header: boolean;
  description: boolean;
  details: boolean;
  btns: boolean;
  width: number | string;
};

export default function Skeleton({
  image = true,
  header = true,
  description = true,
  details = true,
  btns = false,
  width,
}: Props) {
  return (
    <div className="skeleton" style={{ width }}>
      {header && (
        <div className="header">
          {image && <div className="img"></div>}
          {details && (
            <div className="details">
              <span className="name"></span>
              <span className="about"></span>
            </div>
          )}
        </div>
      )}
      {description && (
        <div className="description">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      )}
      {btns && (
        <div className="btns">
          <div className="btn btn-1"></div>
          <div className="btn btn-2"></div>
        </div>
      )}
    </div>
  );
}
