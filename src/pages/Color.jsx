import ColorList from "../components/color";

const Color = ({ isFreeContact = false }) => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <ColorList isFreeContact={isFreeContact} />
        </div>
      </div>
    </div>
  );
};

export default Color;
