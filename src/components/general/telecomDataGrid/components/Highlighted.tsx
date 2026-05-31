import { useTheme } from "@mui/system";

const Highlighted = ({ text = "", highlight = "", style = {} }) => {
  const theme = useTheme();

  if (!highlight?.trim()) {
    return <span>{text}</span>;
  }
  //.*(|{}[(?<=_))${fWordSearched}(]|([?=_])).*
  //(${highlight})
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text?.toString()?.split(regex);
  return (
    <span>
      {parts?.map((part, i) =>
        regex?.test(part) ? (
          <mark
            style={{
              color: theme.palette.black[0],
              backgroundColor: theme.palette.yellow[1],
              ...style,
            }}
            key={i}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export default Highlighted;
