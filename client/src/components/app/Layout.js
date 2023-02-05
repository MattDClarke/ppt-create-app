import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { FormspreeProvider } from '@formspree/react';
import { userContext } from '../../contexts/user.context';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from '../pages/Home';
import Create from '../pages/Create';
import Lists from '../pages/Lists';
import ListPageWithLinks from '../pages/ListPageWithLinks';
import ListPageWithLists from '../pages/ListPageWithLists';
import Guide from '../pages/Guide';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import Contact from '../pages/Contact';
import Admin from '../pages/Admin';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Account from '../pages/Account';
import UpdateName from '../pages/UpdateName';
import UpdateEmail from '../pages/UpdateEmail';
import UpdatePassword from '../pages/UpdatePassword';
import PasswordForgotForm from '../pages/PasswordForgotForm';
import PasswordResetForm from '../pages/PasswordResetForm';
import AddBook from '../pages/AddBook';
import AddListKoreaTextBook from '../pages/AddListKoreaTextBook';
import AddListOther from '../pages/AddListOther';
import Error from '../pages/Error';
import Loader from '../reuseable/Loader';
import { listItems } from '../../helpers/listsValues';
import { Root, classes } from './styles/LayoutStyles';
import PageWithFadeIn from '../pages/PageWithFadeIn';

function Layout() {
  const user = useContext(userContext);
  const otherLists = listItems.map((item) => item.value).join('|');

  return (
    <Root className={classes.root}>
      {user !== undefined ? (
        <>
          <Navbar />
          <Route
            render={({ location }) => (
              <div>
                <Switch location={location}>
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                     <Route
                      path="/"
                      exact
                      render={() => (
                        <PageWithFadeIn key="1">
                          <Create />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : (
                    <Route
                      path="/"
                      exact
                      render={() => (
                        <PageWithFadeIn key="2">
                          <Home />
                        </PageWithFadeIn>
                      )}
                    />
                  )}

                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                      <Route
                      path="/home"
                      exact
                      render={() => (
                        <PageWithFadeIn key="3">
                          <Create />
                        </PageWithFadeIn>
                      )}
                    />
                    ) : (
                    <Route
                      path="/home"
                      exact
                      render={() => (
                        <PageWithFadeIn key="4">
                          <Home />
                        </PageWithFadeIn>
                      )}
                    />
                  )}

                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/create"
                      exact
                      render={() => (
                        <PageWithFadeIn key="5">
                          <Create />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {/* Lists page routes */}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/lists"
                      exact
                      render={() => (
                        <PageWithFadeIn key="6">
                          <Lists />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route path="/lists/:list(korea-textbook)" exact>
                      <Redirect to="/Lists" />
                    </Route>
                  ) : null}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/lists/:list(korea-textbook)/:level(elementary)"
                      exact
                    >
                      <Redirect to="/Lists" />
                    </Route>
                  ) : null}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path={`/lists/:list(${otherLists})`}
                      exact
                      render={() => (
                        <PageWithFadeIn key="7">
                          <ListPageWithLists />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/lists/:list(korea-textbook)/:level(elementary)/:grade(3|4|5|6)"
                      exact
                      render={() => (
                        <PageWithFadeIn key="8">
                          <ListPageWithLinks />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/lists/:list(korea-textbook)/:level(elementary)/:grade(3|4|5|6)/:book"
                      exact
                      render={() => (
                        <PageWithFadeIn key="10">
                          <ListPageWithLists />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  <Route
                    path="/guide"
                    exact
                    render={() => (
                      <PageWithFadeIn key="12">
                        <Guide />
                      </PageWithFadeIn>
                    )}
                  />
                  {user.isAdmin && user.isEmailConfirmed ? (
                    <Route
                      path="/admin"
                      exact
                      render={() => (
                        <PageWithFadeIn key="13">
                          <Admin />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {/* change admin added lists */}
                  {user.isAdmin && user.isEmailConfirmed ? (
                    <Route
                      path="/admin/add-book"
                      exact
                      render={() => (
                        <PageWithFadeIn key="14">
                          <AddBook />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isAdmin && user.isEmailConfirmed ? (
                    <Route
                      path="/admin/add-list-korea-textbook"
                      exact
                      render={() => (
                        <PageWithFadeIn key="15">
                          <AddListKoreaTextBook />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isAdmin && user.isEmailConfirmed ? (
                    <Route
                      path="/admin/add-list-other"
                      exact
                      render={() => (
                        <PageWithFadeIn key="16">
                          <AddListOther />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user ? null : (
                    <Route
                      path="/signup"
                      exact
                      render={() => (
                        <PageWithFadeIn key="17">
                          <Signup />
                        </PageWithFadeIn>
                      )}
                    />
                  )}

                  <Route
                    path="/contact"
                    exact
                    render={() => (
                      <PageWithFadeIn key="18">
                        <FormspreeProvider project="1794143438845771544">
                          <Contact />
                        </FormspreeProvider>
                      </PageWithFadeIn>
                    )}
                  />

                  {/* email confirmation route */}
                  {user ? null : (
                    <Route
                      path="/emailconfirm/:token"
                      exact
                      render={(props) => (
                        <PageWithFadeIn key="19">
                          {/* eslint-disable-next-line */}
                            <Login token={props?.match.params.token} />
                        </PageWithFadeIn>
                      )}
                    />
                  )}
                  {user.isEmailConfirmed ? (
                    // show blank page if /login and user logged out - for /account updating email -
                    // redirect shows 404 briefly when redirected to /login after logged out
                    <Route
                      path="/login"
                      exact
                      render={() => (
                        <PageWithFadeIn key="20">
                          <Login />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : (
                    <Route
                      path="/login"
                      exact
                      render={() => (
                        <PageWithFadeIn key="21">
                          <Login />
                        </PageWithFadeIn>
                      )}
                    />
                  )}
                  {user.isEmailConfirmed || user.auth === 'provider' ? (
                    <Route
                      path="/account"
                      exact
                      render={() => (
                        <PageWithFadeIn key="22">
                          <Account />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed ? (
                    <Route
                      path="/account/name"
                      exact
                      render={() => (
                        <PageWithFadeIn key="23">
                          <UpdateName />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed ? (
                    <Route
                      path="/account/email"
                      exact
                      render={() => (
                        <PageWithFadeIn key="24">
                          <UpdateEmail />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {user.isEmailConfirmed ? (
                    <Route
                      path="/account/password"
                      exact
                      render={() => (
                        <PageWithFadeIn key="25">
                          <UpdatePassword />
                        </PageWithFadeIn>
                      )}
                    />
                  ) : null}
                  {/* password reset */}
                  {user ? null : (
                    <Route
                      path="/account/forgot"
                      exact
                      render={() => (
                        <PageWithFadeIn key="26">
                          <PasswordForgotForm />
                        </PageWithFadeIn>
                      )}
                    />
                  )}
                  {user ? null : (
                    <Route
                      path="/account/reset/:token"
                      exact
                      render={() => (
                        <PageWithFadeIn key="27">
                          <PasswordResetForm />
                        </PageWithFadeIn>
                      )}
                    />
                  )}
                  <Route
                    path="/privacy-policy"
                    exact
                    render={() => (
                      <PageWithFadeIn key="28">
                        <PrivacyPolicy />
                      </PageWithFadeIn>
                    )}
                  />
                  <Route
                    render={() => (
                      <PageWithFadeIn key="29">
                        <Error />
                      </PageWithFadeIn>
                    )}
                  />
                </Switch>
              </div>
            )}
          />
          <Footer />
        </>
      ) : (
        <Loader fullScreen />
      )}
    </Root>
  );
}

export default Layout;
