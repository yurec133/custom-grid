// eslint-disable-next-line react/prop-types
export const DragHandleCell = ({ field, dataItem }) => {
  return (
    <td style={{ touchAction: "none", cursor: "move" }}>
      <span
        className="k-icon k-i-reorder"
        style={{
          cursor: "move",
        }}
        data-drag-handle={true}
      />
      {dataItem[field]}
    </td>
  );
};
